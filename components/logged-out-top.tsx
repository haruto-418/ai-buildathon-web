import { SignInButton } from "@clerk/nextjs";

export function LoggedOutTop() {
  return (
    <div className="flex justify-center py-8">
      <header>
        <SignInButton />
      </header>
      <p>ログアウトしてるよ</p>
    </div>
  );
}
