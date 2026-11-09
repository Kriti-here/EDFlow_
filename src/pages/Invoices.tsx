import PageShell from "../components/PageShell";
import { getNavItem } from "../config/navigation";

const { label, description } = getNavItem("/invoices");

function Invoices() {
  return <PageShell title={label} description={description} />;
}

export default Invoices;
