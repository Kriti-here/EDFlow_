import PageShell from "../components/PageShell";
import { getNavItem } from "../config/navigation";

const { label, description } = getNavItem("/exceptions");

function ExceptionsHub() {
  return <PageShell title={label} description={description} />;
}

export default ExceptionsHub;
