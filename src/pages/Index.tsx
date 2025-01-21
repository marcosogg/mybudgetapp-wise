import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, DollarSign, PieChart, Wallet } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-budget-gray font-bricolage">
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-facebook text-3xl font-bold">MyBudget</h1>
          <Button variant="outline" className="text-facebook hover:bg-facebook hover:text-white">
            Login
          </Button>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              Take control of your finances
            </h2>
            <p className="text-xl text-gray-600">
              Track expenses, set budgets, and achieve your financial goals with MyBudget's simple and powerful tools.
            </p>
            <div className="space-y-4">
              <FeatureItem
                icon={<DollarSign className="w-6 h-6" />}
                title="Track Expenses"
                description="Import and categorize your transactions automatically"
              />
              <FeatureItem
                icon={<PieChart className="w-6 h-6" />}
                title="Visual Insights"
                description="See where your money goes with beautiful charts"
              />
              <FeatureItem
                icon={<Wallet className="w-6 h-6" />}
                title="Budget Management"
                description="Set and track budgets for different categories"
              />
            </div>
          </div>

          <div>
            <Card className="p-6 shadow-lg">
              <h3 className="text-2xl font-bold mb-6">Get Started Today</h3>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Enter your email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" placeholder="Create a password" />
                </div>
                <Button className="w-full bg-facebook hover:bg-facebook-hover text-white">
                  Sign Up <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </form>
              <p className="text-center text-sm text-gray-600 mt-4">
                Already have an account?{" "}
                <a href="#" className="text-facebook hover:underline">
                  Log in
                </a>
              </p>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

const FeatureItem = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="flex items-start space-x-4">
    <div className="bg-facebook/10 p-2 rounded-lg text-facebook">{icon}</div>
    <div>
      <h3 className="font-semibold text-gray-900">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  </div>
);

export default Index;