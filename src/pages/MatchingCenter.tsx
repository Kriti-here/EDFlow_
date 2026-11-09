import PageShell from "../components/PageShell";
import { getNavItem } from "../config/navigation";

const { label, description } = getNavItem("/matching");

function MatchingCenter() {
  return <PageShell title={label} description={description} />;
}

export default MatchingCenter;
