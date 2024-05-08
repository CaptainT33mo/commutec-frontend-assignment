import Button from "@/app/_components/Button";
import FieldWrapper from "@/app/_components/Form/FieldWrapper";
import Input from "@/app/_components/Input";
import { useStore } from "@/store/zustand";
import { api } from "@/trpc/react";
import { AppRoutes } from "@/utils/appRoutes";
import { maskEmail } from "@/utils/helpers";
import { useRouter } from "next/navigation";
import { useState } from "react";
import OtpInput from "react-otp-input";

export default function OTPVerification({
  email,
  userId,
}: {
  email: string;
  userId: string;
}) {
  const router = useRouter();
  const { updateToken } = useStore();
  const [otp, setOtp] = useState("");
  const [errorText, setErrorText] = useState("");
  const verifyUser = api.auth.verifyOTP.useMutation({
    onSuccess: (resp) => {
      // updateToken(resp?.token);
      if (resp.success) router.push(AppRoutes.DASHBOARD);
    },
  });

  const verifyCode = () => {
    if (otp?.trim() !== "") {
      verifyUser.mutate({ otp: parseInt(otp), userId });
    } else {
      setErrorText("Please enter code");
    }
  };
  return (
    <div>
      <h2 className="text-center text-3xl font-semibold text-black">
        Verify your email
      </h2>
      <div className="my-8 text-center">
        <p className="mt-2 text-base text-black">
          Enter the 8 digit code you have received on {maskEmail(email)}
        </p>
      </div>
      <FieldWrapper
        label="Code"
        required
        infoText="For demo purpose use any 8 digit number to sign up"
        errorText={errorText}
      >
        <OtpInput
          value={otp}
          onChange={setOtp}
          numInputs={8}
          inputType="number"
          renderSeparator={<span className="px-2" />}
          renderInput={(props) => (
            <Input
              {...props}
              className="!px-1 !py-1 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
          )}
        />
        <div className="mt-6">
          <Button
            onClick={verifyCode}
            className="uppercase"
            loading={verifyUser.isPending}
            disabled={verifyUser.isPending}
            fullWidth
          >
            Verify
          </Button>
        </div>
      </FieldWrapper>
    </div>
  );
}
