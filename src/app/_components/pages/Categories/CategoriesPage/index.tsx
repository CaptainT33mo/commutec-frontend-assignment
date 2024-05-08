import Checkbox from "@/app/_components/Checkbox";
import { useEffect, useState } from "react";
import { api } from "@/trpc/react";
import type { Category } from "types";
import Pagination from "@/app/_components/Pagination";
import { useStore } from "@/store/zustand";
import { Store } from "react-notifications-component";
import PageLoader from "@/app/_components/Loaders/PageLoader";

export default function CategoriesPage() {
  const { userDetails } = useStore();
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 6;

  const categoriesQueryEnabled = !!userDetails?.id;

  const categories = api.categories.list.useQuery(
    {
      page: currentPage,
      pageSize: pageSize,
    },
    { enabled: categoriesQueryEnabled },
  );

  const userSelectedCategories = api.user.getSelectedCategories.useQuery(
    {
      userId: userDetails?.id ?? 1,
    },
    {
      enabled:
        categoriesQueryEnabled && !!categories?.data?.categoryData?.length,
    },
  );

  useEffect(() => {
    // Updating user categories based on his selected categories from DB
    if (userSelectedCategories?.data?.categories) {
      const oldData: number[] = userSelectedCategories?.data?.categories?.map(
        (category) => category.id,
      );
      setSelectedCategories([...oldData]);
    }
  }, [
    categories?.data?.categoryData,
    userSelectedCategories?.data?.categories,
    userDetails?.id,
  ]);

  useEffect(() => {
    if (!categories.isLoading && !userSelectedCategories.isLoading) {
      setLoading(false); // Set loading to false when data is fetched
    }
  }, [categories.isLoading, userSelectedCategories.isLoading]);

  const updateUserCategories = api.categories.addCategoryToUser.useMutation({
    onSuccess: (resp) => {
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

  const handleCheckboxChange = (categoryId: number, checked: boolean) => {
    setSelectedCategories((prevSelectedCategories) => {
      if (checked && userDetails?.id) {
        updateUserCategories.mutate({
          categoryId,
          userId: userDetails?.id,
        });
        return [...prevSelectedCategories, categoryId];
      } else {
        return prevSelectedCategories.filter((id) => id !== categoryId);
      }
    });
  };

  if (loading) {
    return <PageLoader />;
  }
  if (categories.isError || userSelectedCategories.isError)
    return <div>Error fetching data</div>;

  return !categoriesQueryEnabled ? (
    <PageLoader />
  ) : (
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

        {categories?.isLoading || userSelectedCategories?.isLoading ? (
          <div>Loading categories...</div>
        ) : (
          <>
            <div className="flex flex-col gap-4">
              {categories?.data?.categoryData?.map((category: Category) => (
                <Checkbox
                  key={category.id}
                  id={category.id.toString()}
                  label={category.name}
                  checked={selectedCategories.includes(category.id)}
                  onChange={(checked: boolean) =>
                    handleCheckboxChange(category.id, checked)
                  }
                  disabled={updateUserCategories?.isPending}
                />
              ))}
            </div>

            <Pagination
              className="mt-8"
              currentPage={currentPage}
              totalCount={categories?.data?.totalCount ?? 0}
              pageSize={pageSize}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </>
        )}
      </div>
    </div>
  );
}
