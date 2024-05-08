"use client";

import { Form, Formik } from "formik";
import { ZodError, z } from "zod";
import Button from "@/app/_components/Button";
import FormInput from "@/app/_components/Form/FormInput";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { AppRoutes } from "@/utils/appRoutes";
import { useStore } from "@/store/zustand";

const ValidationSchema = z.object({
  name: z.string().min(2, "Name is too short").max(200, " Name is too long"),
  email: z
    .string()
    .email("Invalid email address")
    .min(5, " Email is too short"),
  password: z.string().min(8, "Password is too short"),
});
type FormValues = z.infer<typeof ValidationSchema>;

export default function SignUp() {
  const router = useRouter();
  const { setUserDetails } = useStore();
  const initialValues: FormValues = {
    name: "",
    email: "",
    password: "",
  };

  const createUser = api.auth.signup.useMutation({
    onSuccess: (resp) => {
      if (resp?.success) {
        setUserDetails(resp.data);
        router.push(AppRoutes.VERIFY);
      }
    },
  });

  const validateForm = (values: FormValues) => {
    try {
      ValidationSchema.parse(values);
    } catch (error) {
      if (error instanceof ZodError) {
        return error.formErrors.fieldErrors;
      }
    }
  };

  const onFormSubmit = (values: FormValues) => {
    createUser.mutate({ ...values });
  };

  return (
    <div className="rounded-2xl border p-10">
      <>
        <h2 className="mb-6 text-center text-3xl font-semibold text-black">
          Create your account
        </h2>
        <div>
          <Formik
            initialValues={initialValues}
            validate={validateForm}
            onSubmit={onFormSubmit}
          >
            <Form>
              <div className="flex flex-col gap-6">
                <FormInput name="name" label="Full Name" type="text" required />
                <FormInput name="email" label="Email" type="email" required />
                <FormInput
                  name="password"
                  label="Password"
                  type="password"
                  required
                />

                <div>
                  <Button
                    type="submit"
                    fullWidth
                    loading={createUser?.isPending}
                    disabled={createUser?.isPending}
                    className="uppercase"
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </Form>
          </Formik>
        </div>
        <div className="my-6 border"></div>
        <div className="flex items-center justify-center gap-3">
          <p>Have an Account?</p>
          <Button link="/auth/login" variant="link">
            LOGIN
          </Button>
        </div>
      </>
    </div>
  );
}
