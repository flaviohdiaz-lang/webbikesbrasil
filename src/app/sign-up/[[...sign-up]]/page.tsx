import NavbarLogo from "@/components/NavbarLogo";
import { SignUp } from "@clerk/nextjs";
import Link from "next/link";

export const metadata = {
  title: "Criar conta — Web Bikes Brasil",
  description: "Crie sua conta no Web Bikes Brasil.",
};

export default function SignUpPage() {
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
          <SignUp
            routing="path"
            path="/sign-up"
            signInUrl="/sign-in"
            forceRedirectUrl="/"
            fallbackRedirectUrl="/"
          />
        </div>
      </main>
    </div>
  );
}
