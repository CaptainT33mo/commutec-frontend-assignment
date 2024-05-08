"use client";

import Button from "@/app/_components/Button";
import FormInput from "@/app/_components/Form/FormInput";
import { useStore } from "@/store/zustand";
import { api } from "@/trpc/react";
import { AppRoutes } from "@/utils/appRoutes";
import { Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import { ZodError, z } from "zod";

const ValidationSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .min(5, " Email is too short"),
  password: z.string().min(8, "Password is too short"),
});
type FormValues = z.infer<typeof ValidationSchema>;

export default function Login() {
  const { updateToken } = useStore();
  const router = useRouter();
  const initialValues = {
    email: "",
    password: "",
  };

  const loginUser = api.auth.login.useMutation({
    onSuccess: (resp) => {
      if (resp.success) {
        updateToken(resp.data.accessToken);
        router.push(AppRoutes.DASHBOARD);
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
    loginUser.mutate({ ...values });
  };

  return (
    <div className="rounded-2xl border p-10">
      <h2 className="text-center text-3xl font-semibold text-black">Login</h2>
      <div className="my-8 text-center">
        <p className="text-2xl font-medium text-black">
          Welcome back to ECOMMERCE
        </p>
        <p className="mt-2 text-base text-black">
          The next gen business marketplace
        </p>
      </div>
      <div>
        <Formik
          initialValues={initialValues}
          validate={validateForm}
          onSubmit={onFormSubmit}
        >
          <Form>
            <div className="flex flex-col gap-6">
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
                  loading={loginUser?.isPending}
                  disabled={loginUser?.isPending}
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
        <p>Don’t have an Account?</p>
        <Button link="/auth/signup" variant="link">
          SIGN UP
        </Button>
      </div>
    </div>
  );
}
