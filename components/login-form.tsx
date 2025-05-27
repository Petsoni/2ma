"use client";

import {useState} from "react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {cn} from "@/lib/utils";
import {useRouter} from "next/navigation";

export function LoginForm({className, ...props}: React.ComponentProps<"div">) {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const routes = useRouter();

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		const form = e.currentTarget as HTMLFormElement;
		const password = form.password.value;

		try {
			if (password != null && password == '2803cunce') {
				routes.push("/memories")
			} else {
				throw new Error()
			}
		} catch (err) {
			setError("Taša bi znala odgovor...");
			console.error("Login error:", err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card>
				<CardHeader>
					<CardTitle>Samo Taša ima pristup</CardTitle>
					<CardDescription>
						Uloguj se kako bi videla nešto lepo :)
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleLogin}>
						<div className="flex flex-col gap-6">
							<div className="grid gap-3">
								<Label htmlFor="password">Šifra</Label>
								<Input
									id="password"
									name="password"
									type="password"
									placeholder="Šifra"
									required
									disabled={loading}
								/>
							</div>
							{error && <p className="text-red-500 text-sm">{error}</p>}
							<div className="flex flex-col gap-3">
								<Button type="submit" className="w-full" disabled={loading}>
									{loading ? "Učitavam..." : "Nastavi"}
								</Button>
							</div>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
