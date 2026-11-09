import PageShell from "../components/PageShell";
import { getNavItem } from "../config/navigation";

const { label, description } = getNavItem("/edf-packs");

function EDFPacks() {
  return <PageShell title={label} description={description} />;
}

export default EDFPacks;
