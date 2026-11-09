import PageShell from "../components/PageShell";
import { getNavItem } from "../config/navigation";

const { label, description } = getNavItem("/purpose");

function PurposeAdvisor() {
  return <PageShell title={label} description={description} />;
}

export default PurposeAdvisor;
