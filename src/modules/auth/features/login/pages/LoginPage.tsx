
import React, { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button, Input, Label, Header } from "@/components/ui";
import { login } from "@/modules/auth/services";

interface LoginPageProps {
  onLoginSuccess: () => void;
}

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await login(email, password);
      // FIX: Check for 'token' instead of 'accessToken'
      const token = response.data?.token || response.data?.accessToken;
      
      if (token) {
        localStorage.setItem("TOKEN_AUTH", token);
        onLoginSuccess();
      } else {
        throw new Error("No se recibió el token de acceso.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error al iniciar sesión");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 antialiased selection:bg-primary/30">
      <div className="w-full max-w-[350px] flex flex-col gap-8">
        <Header
          title="Ingresar a mi cuenta"
          description="Ingresa tus credenciales para acceder a la plataforma legal de Arxatec."
        />

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          {error && (
            <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium animate-in fade-in slide-in-from-top-1">
                {error}
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              type="email"
              placeholder="Ej.correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Contraseña</Label>
              <a
                href="https://abogado.arxatec.net/recuperar-cuenta"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Ej.cfaWR252$Mja"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pr-10"
              />
              <button
                type="button"
                className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-4">
            <Button
              type="submit"
              className="w-full h-11 font-semibold"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Ingresando...
                </>
              ) : (
                "Ingresar"
              )}
            </Button>

            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-background px-2 text-muted-foreground tracking-widest">
                  O ingresa con
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              type="button"
              onClick={() =>
                (window.location.href =
                  "https://abogado.arxatec.net/api/auth/login/google")
              }
              className="w-full h-11 border-border/50 bg-card/50"
            >
              <svg
                className="mr-2 h-4 w-4"
                viewBox="0 0 488 512"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="currentColor"
                  d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                ></path>
              </svg>
              Ingresa con Google
            </Button>
          </div>
        </form>

        <div className="text-center text-sm">
          <span className="text-muted-foreground">¿No tienes una cuenta?</span>{" "}
          <a
            href="https://abogado.arxatec.net/registrarse" 
            target="_blank"
            className="font-semibold text-foreground hover:text-primary transition-colors underline underline-offset-4"
          >
            Registrarse
          </a>
        </div>
      </div>
    </div>
  );
}
