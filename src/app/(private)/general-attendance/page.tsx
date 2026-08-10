"use client";

import { GeneralAttendancePage } from "@/features/general-attendance";
import { withPagePermission } from "@/components/guards/withPagePermission";
import Loading from "./loading";

function Page() {
  return <GeneralAttendancePage />;
}

export default withPagePermission(Page, {
  loadingComponent: <Loading />,
});
