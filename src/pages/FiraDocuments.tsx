import PageShell from "../components/PageShell";
import { getNavItem } from "../config/navigation";

const { label, description } = getNavItem("/fira");

function FiraDocuments() {
  return <PageShell title={label} description={description} />;
}

export default FiraDocuments;
