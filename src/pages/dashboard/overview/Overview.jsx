import Balance from "./components/Balance";
import Upcoming from "./components/Upcoming";
import Expenses from "./components/Expenses";
import Goals from "./components/Goals";
import Statistics from "./components/Statistics";
import Recents from "./components/Recents";
import { Joyride } from "react-joyride";
import { useEffect, useState } from "react";
import { useProfile } from "../../../hooks/features/settings/useProfile";
import Loader from "../../../components/ui/Loader";
import { useUpdateProfile } from "../../../hooks/features/settings/useUpdateProfile";

function Overview() {
  const { data: profile, isLoading } = useProfile();

  const { mutate: updateTour } = useUpdateProfile();

  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    if (profile) {
      setShowTour(!profile.has_seen_tour);
    }
  }, [profile]);

  const steps = [
    {
      target: "#overview",
      title: "Welcome to PayIO!",
      content:
        "PayIO helps you track your money, monitor spending, stay ahead of bills, and work toward your savings goals—all in one place. Let's get everything set up in less than a minute.",
      placement: "center",
    },

    {
      target: "#balances",
      title: "Start With Your Accounts",
      content:
        "Add a balance for the accounts you use most often. The accounts will be generated automatically for practical purposes. It can be your bank account, debit card, or any type of account you want to track.",
    },

    {
      target: "#stats",
      title: "Record Your Activity",
      content:
        "Transactions keep your finances up to date. Add income when money comes in and expenses when money goes out. Every transaction automatically contributes to your financial insights.",
    },

    {
      target: "#bills",
      title: "Never Miss a Payment",
      content:
        "Add upcoming bills to stay organized and avoid surprises. PayIO helps you keep track of due dates, amounts, and recurring payments all in one place.",
    },

    {
      target: "#goals",
      title: "Turn Savings Into Progress",
      content: "Set financial goals and track your progress over time.",
    },

    {
      target: "#overview",
      title: "You're All Set!",
      content:
        "Your financial dashboard is ready. Start by adding your balances and transactions, and let PayIO handle the rest.",
      placement: "center",
    },
  ];

  function handleJoyrideCallback(data) {
    const { status } = data;

    if (status === "finished") {
      updateTour({ has_seen_tour: true });
    }
  }

  if (isLoading) return <Loader />;

  return (
    <div id="overview" className="flex flex-col gap-6 xl:gap-8">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
        <Balance />

        <Goals />

        <div className="xl:hidden">
          <Recents />
        </div>

        <Upcoming />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        <div className="hidden xl:block">
          <Recents />
        </div>

        <div className="flex flex-col gap-8 xl:col-span-2">
          <Statistics />

          <Expenses />
        </div>
      </div>

      {showTour && (
        <Joyride
          steps={steps}
          run={showTour}
          continuous
          options={{ skipBeacon: true, showProgress: true }}
          onEvent={handleJoyrideCallback}
          styles={{
            buttonPrimary: {
              backgroundColor: "#299d91",
              outline: "none",
              padding: "10px",
            },
            tooltip: { padding: "20px" },
            buttonClose: { padding: "16px" },
          }}
          locale={{ last: "Get Started" }}
        />
      )}
    </div>
  );
}

export default Overview;
