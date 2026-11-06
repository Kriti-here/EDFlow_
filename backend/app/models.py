"""SQLAlchemy models for the EDFlow starter backend.

This is the minimum schema required by the currently supplied routers,
services and tests. FIRA/matching/EDF models are intentionally not invented
here; they belong in the next product phase.
"""
from datetime import date, datetime, timezone
from decimal import Decimal

from sqlalchemy import Boolean, Date, DateTime, ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.types import TypeDecorator
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .db import Base


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


class Money(TypeDecorator):
    """Exact decimal stored as text, so SQLite never turns money into a float.

    Sort and total in Python (Decimal), not in SQL, because the column is text.
    """
    impl = String(40)
    cache_ok = True

    def process_bind_param(self, value, dialect):
        return None if value is None else str(Decimal(str(value)))

    def process_result_value(self, value, dialect):
        return None if value is None else Decimal(value)


class ExporterProfile(Base):
    __tablename__ = "exporter_profiles"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    legal_name: Mapped[str] = mapped_column(String(300), nullable=False)
    entity_type: Mapped[str] = mapped_column(String(40), nullable=False, default="company")
    pan: Mapped[str | None] = mapped_column(String(20))
    gstin: Mapped[str | None] = mapped_column(String(20))
    lut_number: Mapped[str | None] = mapped_column(String(100))
    lut_not_applicable: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    ad_bank_name: Mapped[str | None] = mapped_column(String(200))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, onupdate=utcnow, nullable=False)


class Client(Base):
    __tablename__ = "clients"
    __table_args__ = (UniqueConstraint("email", name="uq_clients_email"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(300), nullable=False)
    email: Mapped[str] = mapped_column(String(320), nullable=False, index=True)
    country: Mapped[str | None] = mapped_column(String(100))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, onupdate=utcnow, nullable=False)
    invoices: Mapped[list["Invoice"]] = relationship(back_populates="client")


class Invoice(Base):
    __tablename__ = "invoices"
    __table_args__ = (UniqueConstraint("number", name="uq_invoices_number"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    number: Mapped[str] = mapped_column(String(40), nullable=False, index=True)
    client_id: Mapped[int] = mapped_column(ForeignKey("clients.id"), nullable=False)
    issue_date: Mapped[date] = mapped_column(Date, nullable=False)
    due_date: Mapped[date] = mapped_column(Date, nullable=False)
    currency: Mapped[str] = mapped_column(String(3), nullable=False)
    amount: Mapped[Decimal] = mapped_column(Money, nullable=False)
    service_description: Mapped[str] = mapped_column(Text, nullable=False, default="")
    contract_ref: Mapped[str | None] = mapped_column(String(120))
    purpose_code: Mapped[str | None] = mapped_column(String(20))
    purpose_code_source: Mapped[str | None] = mapped_column(String(30))
    status: Mapped[str] = mapped_column(String(30), nullable=False, default="DRAFT")
    paypal_invoice_id: Mapped[str | None] = mapped_column(String(100), unique=True)
    paypal_invoice_url: Mapped[str | None] = mapped_column(Text)
    paypal_order_id: Mapped[str | None] = mapped_column(String(100), unique=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, onupdate=utcnow, nullable=False)

    client: Mapped["Client"] = relationship(back_populates="invoices")
    payments: Mapped[list["Payment"]] = relationship(back_populates="invoice")


class Payment(Base):
    __tablename__ = "payments"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    invoice_id: Mapped[int | None] = mapped_column(ForeignKey("invoices.id"), nullable=True, index=True)
    paypal_event_id: Mapped[str | None] = mapped_column(String(100), index=True)
    paypal_capture_id: Mapped[str] = mapped_column(String(120), nullable=False, unique=True)
    paid_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    currency: Mapped[str | None] = mapped_column(String(3))
    gross: Mapped[Decimal | None] = mapped_column(Money)
    paypal_fee: Mapped[Decimal | None] = mapped_column(Money)
    net: Mapped[Decimal | None] = mapped_column(Money)
    receivable_currency: Mapped[str | None] = mapped_column(String(3))
    receivable_amount: Mapped[Decimal | None] = mapped_column(Money)
    fx_rate: Mapped[Decimal | None] = mapped_column(Money)
    fx_rate_source: Mapped[str | None] = mapped_column(String(40))
    data_source: Mapped[str] = mapped_column(String(50), nullable=False, default="paypal-capture")
    raw_json: Mapped[str] = mapped_column(Text, nullable=False, default="{}")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, nullable=False)

    invoice: Mapped["Invoice | None"] = relationship(back_populates="payments")


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    ts: Mapped[str] = mapped_column(String(40), nullable=False)
    actor: Mapped[str] = mapped_column(String(40), nullable=False)
    action: Mapped[str] = mapped_column(String(100), nullable=False)
    entity: Mapped[str] = mapped_column(String(80), nullable=False)
    entity_id: Mapped[str] = mapped_column(String(120), nullable=False)
    details_json: Mapped[str] = mapped_column(Text, nullable=False, default="{}")
    prev_hash: Mapped[str] = mapped_column(String(64), nullable=False)
    hash: Mapped[str] = mapped_column(String(64), nullable=False)


class WebhookEvent(Base):
    __tablename__ = "webhook_events"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    paypal_event_id: Mapped[str] = mapped_column(String(120), nullable=False, unique=True)
    event_type: Mapped[str] = mapped_column(String(120), nullable=False)
    received_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, nullable=False)