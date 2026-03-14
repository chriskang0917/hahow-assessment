import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, LoaderCircle, Shield } from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link } from "@/components/ui/link";
import { Typography } from "@/components/ui/typography";

export const Route = createFileRoute("/auth/root-2-fa")({
  component: RouteComponent,
});

function RouteComponent() {
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (value.length !== 6) {
      setError("請輸入完整的 6 位數驗證碼");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("驗證碼:", value);
    } catch {
      setError("驗證碼錯誤，請重新輸入");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md border-0 shadow-xl">
      <CardHeader className="space-y-2 text-center">
        <div className="mb-4 flex justify-center">
          <div className="rounded-full bg-purple-100 p-3">
            <Shield className="h-6 w-6 text-purple-600" />
          </div>
        </div>
        <CardTitle className="text-xl font-semibold">輸入驗證碼</CardTitle>
        <CardDescription className="text-gray-600">請至 Slack 確認當前有效的驗證碼</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <Input
              type="text"
              placeholder="請輸入驗證碼"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                setError("");
              }}
              maxLength={6}
              className="text-center font-mono text-lg tracking-widest"
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full"
            variant="default"
            disabled={isLoading || value.length !== 6}
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <LoaderCircle className="h-4 w-4 animate-spin" />
                <Typography>驗證中...</Typography>
              </div>
            ) : (
              <>繼續</>
            )}
          </Button>
        </form>

        <Link to="/auth/login">
          <ArrowLeft className="h-4 w-4" />
          <span>返回登入頁面</span>
        </Link>
      </CardContent>
    </Card>
  );
}
