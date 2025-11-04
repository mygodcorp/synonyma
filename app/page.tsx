import { dehydrate, QueryClient } from "@tanstack/react-query";
import getMostSearchedWord from "lib/supabase/queries/get-most-searched";
import HomeClient from "./home-client";
import { HydrationBoundary } from "@tanstack/react-query";

export const revalidate = 10000;

export default async function Home() {
  const queryClient = new QueryClient();
  
  await queryClient.fetchQuery({
    queryKey: ["homepage"],
    queryFn: () => getMostSearchedWord(10),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <HomeClient limit={10} />
    </HydrationBoundary>
  );
}
