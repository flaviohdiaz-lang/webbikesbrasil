import NavbarLogo from "@/components/NavbarLogo";
import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

export const metadata = {
  title: "Entrar — Web Bikes Brasil",
  description: "Faça login na sua conta Web Bikes Brasil.",
};

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarLogo />

      <main className="mx-auto flex max-w-6xl flex-col items-center px-4 py-12">
        <Link
          href="/"
          className="mb-8 self-start text-sm font-medium text-emerald-600 hover:text-emerald-700"
        >
          ← Voltar ao início
        </Link>

        <div className="flex w-full max-w-md justify-center">
          <SignIn
            routing="path"
            path="/sign-in"
            signUpUrl="/sign-up"
            forceRedirectUrl="/"
            fallbackRedirectUrl="/"
          />
        </div>
      </main>
    </div>
  );
}
