import Account from "./components/Account";
import Security from "./components/Security";
import Card from "../../../components/ui/Card";
import Tabs from "../../../components/ui/Tabs";
import { useTabParams } from "../../../hooks/useTabParams";
import { useSearchParams } from "react-router-dom";

function Settings() {
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = searchParams.get("tab") || "account";

  const tabs = ["account", "security"];

  useTabParams("account", tabs);

  return (
    <section>
      <Card variant="list" className="!items-start !px-8 !pb-12 w-full">
        <Tabs
          variant="settings"
          tabs={tabs}
          activeTab={activeTab}
          onChange={(tab) => setSearchParams({ tab: tab })}
        />

        {activeTab === "account" ? <Account /> : <Security />}
      </Card>
    </section>
  );
}

export default Settings;
