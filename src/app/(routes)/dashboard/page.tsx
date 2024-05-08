"use client";

import Checkbox from "@/app/_components/Checkbox";
import { useEffect, useState } from "react";
import { api } from "@/trpc/react";
import Pagination from "@/app/_components/Pagination";
import { Store } from "react-notifications-component";
import PageLoader from "@/app/_components/Loaders/PageLoader";

interface Interests {
  interestId: string;
  interestName: string;
  interestChecked: boolean;
}

export default function Dashboard() {
  const [interests, setInterests] = useState<Interests[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 6;

  const fetchedInterests = api.interest.fetchAllInterests.useQuery({
    pageNumber: currentPage,
    pageSize: pageSize,
  });
  const {
    data: fetchedUserInterests,
    refetch,
    isFetching: isUserInterestsFetching,
    isError,
  } = api.interest.fetchUserInterests.useQuery();

  useEffect(() => {
    if (fetchedInterests.data?.interests && fetchedUserInterests?.interests) {
      const modifiedInterests = fetchedInterests.data.interests.map((i) => ({
        interestId: i.id,
        interestName: i.name,
        interestChecked:
          fetchedUserInterests?.interests.filter((o) => o.interestId === i.id)
            .length > 0
            ? true
            : false,
      }));
      setInterests(modifiedInterests);
    }
    void refetch();
  }, [fetchedInterests.data]);

  useEffect(() => {
    if (!fetchedInterests.isLoading && !isUserInterestsFetching) {
      setLoading(false); // Set loading to false when data is fetched
    }
  }, [fetchedInterests.isLoading, isUserInterestsFetching]);

  const addUserInterest = api.interest.addUserInterest.useMutation({
    onSuccess: (resp) => {
      if (resp.success)
        Store.addNotification({
          title: "Success",
          message: resp?.message,
          type: "success",
          insert: "top",
          container: "top-right",
          animationIn: ["animate__animated", "animate__fadeIn"],
          animationOut: ["animate__animated", "animate__fadeOut"],
          dismiss: {
            duration: 6500,
            onScreen: true,
          },
        });
    },
  });

  const removeUserInterest = api.interest.deleteUserInterest.useMutation({
    onSuccess: (resp) => {
      if (resp.success)
        Store.addNotification({
          title: "Success",
          message: resp?.message,
          type: "success",
          insert: "top",
          container: "top-right",
          animationIn: ["animate__animated", "animate__fadeIn"],
          animationOut: ["animate__animated", "animate__fadeOut"],
          dismiss: {
            duration: 6500,
            onScreen: true,
          },
        });
    },
  });

  const handleCheckboxChange = async (checked: boolean, interestId: string) => {
    if (checked) {
      addUserInterest.mutate({ interestId });
      await refetch();
    } else {
      const interestToRemove = fetchedUserInterests?.interests?.find(
        (o) => o.interestId === interestId,
      );
      if (fetchedUserInterests?.interests && interestToRemove)
        removeUserInterest.mutate({
          userInterestId: interestToRemove.id,
        });
    }
  };

  if (loading) {
    return <PageLoader />;
  }
  if (fetchedInterests.isError || isError)
    return <div>Error fetching data</div>;

  return (
    <div className="mx-auto max-w-xl">
      <div className="rounded-2xl border p-10">
        <h2 className="text-center text-3xl font-semibold text-black">
          Please mark your interests!
        </h2>
        <div className="my-8 text-center">
          <p className="mt-2 text-base text-black">
            We will keep you notified.
          </p>
        </div>

        <div className="mb-4">
          <h4 className="text-xl font-medium text-black">
            My saved interests!
          </h4>
        </div>

        {fetchedInterests?.isLoading || isUserInterestsFetching ? (
          <div>Loading categories...</div>
        ) : (
          <>
            <div className="flex flex-col gap-4">
              {interests?.map((interest: Interests) => (
                <Checkbox
                  key={interest.interestId}
                  id={interest.interestId}
                  label={interest.interestName}
                  checked={interest.interestChecked}
                  onChange={(checked: boolean) => {
                    const tempInterests = interests.map((i) => {
                      if (i.interestId === interest.interestId) {
                        return { ...i, interestChecked: checked };
                      }
                      return i;
                    });
                    setInterests(tempInterests);
                    void handleCheckboxChange(checked, interest.interestId);
                  }}
                  disabled={
                    addUserInterest?.isPending || removeUserInterest?.isPending
                  }
                />
              ))}
            </div>

            <Pagination
              className="mt-8"
              currentPage={currentPage}
              totalCount={fetchedInterests?.data?.totalCount ?? 0}
              pageSize={pageSize}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </>
        )}
      </div>
    </div>
  );
}
