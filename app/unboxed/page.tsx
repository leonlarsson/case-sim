import { Suspense } from "react";
import Link from "next/link";
import { RefreshButton } from "@/components/RefreshButton";
import { SettingsCheckboxes } from "@/components/SettingsCheckboxes";
import { GlobalItemHistory } from "@/components/GlobalItemHistory";
import { Button } from "@/components/Button";
import { Icons } from "@/components/icons";
import { formatDecimal } from "@/utils/formatters";
import {
  getTotalFilteredUnboxes,
  getTotalUnboxesLast24Hours,
} from "@/lib/repositories/unboxes";

export const metadata = {
  title: "Global Unbox History | Counter-Strike Case Simulator",
};

export default ({
  searchParams: { onlyCoverts, onlyPersonal },
}: {
  searchParams: { onlyCoverts?: string; onlyPersonal?: string };
}) => {
  return (
    <main id="main" className="select-none">
      <div className="relative flex min-h-screen flex-col py-2 backdrop-blur-md">
        <Button
          variant="secondary-darker"
          href="/"
          className="absolute inset-2 size-fit p-1 max-[650px]:hidden"
        >
          <Icons.chevronLeft className="size-6" />
        </Button>

        <span className="text-center text-3xl font-medium">
          Last 100 {onlyCoverts ? "coverts" : "items"} unboxed by{" "}
          {onlyPersonal ? (
            <span title="As identified by an anonymous cookie.">you</span>
          ) : (
            "the community"
          )}
        </span>

        <Suspense
          fallback={
            <span className="text-center">
              Loading... <br />
              Loading...
            </span>
          }
        >
          <TotalSpend
            onlyCoverts={onlyCoverts === "true"}
            onlyPersonal={onlyPersonal === "true"}
          />
        </Suspense>

        <Link
          href="/"
          className="mx-auto w-fit text-center text-lg font-medium hover:underline"
        >
          Open some more!
        </Link>

        <hr className="mx-auto mt-5 w-full px-20 opacity-30" />

        <div className="my-2 flex justify-center">
          <SettingsCheckboxes />
        </div>

        <Suspense fallback={<span className="text-center">Loading...</span>}>
          <GlobalItemHistory
            onlyCoverts={onlyCoverts === "true"}
            onlyPersonal={onlyPersonal === "true"}
          />
        </Suspense>

        {onlyPersonal && !onlyCoverts && (
          <span className="my-5 place-items-end text-center">
            Older non-covert items are regularly deleted from the database.
          </span>
        )}
      </div>
    </main>
  );
};

const TotalSpend = async ({
  onlyCoverts,
  onlyPersonal,
}: {
  onlyCoverts: boolean;
  onlyPersonal: boolean;
}) => {
  const [totalUnboxed, totalUnboxed24h] = await Promise.all([
    getTotalFilteredUnboxes(onlyCoverts, onlyPersonal),
    getTotalUnboxesLast24Hours(),
  ]);

  return (
    <span className="text-center">
      <span>
        <span className="font-medium tracking-wide">
          {totalUnboxed.toLocaleString("en")}
        </span>{" "}
        {onlyCoverts ? "coverts" : "items"} unboxed.{" "}
        <span
          className="font-medium tracking-wide"
          title={`That's $${formatDecimal(totalUnboxed * 2.5)}`}
        >
          {formatDecimal(totalUnboxed * 2.35)}€
        </span>{" "}
        spent on imaginary keys.
      </span>

      <RefreshButton />

      <br />

      <span title="All items, regardless of rarity.">
        <span className="font-medium tracking-wide">
          {totalUnboxed24h.toLocaleString("en")}
        </span>{" "}
        items unboxed in the last 24 hours.
      </span>
    </span>
  );
};
