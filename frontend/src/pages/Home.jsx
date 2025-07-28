import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import {
  MessageSquare,
  Trophy,
  ArrowRight,
  Star,
  CheckCircle,
  Lightbulb,
} from "lucide-react";
import Navbar from "../components/common/Navbar.jsx";
import Footer from "../components/common/Footer.jsx";
export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50">
    <Navbar/>
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center space-y-8">
          {/* Badge */}
          <Badge
            variant="secondary"
            className="bg-cyan-100 text-cyan-700 px-4 py-2 text-sm"
          >
            <Star className="w-4 h-4 mr-2" />
            Join 1000+ developers
          </Badge>

          {/* Main Heading */}
          <h1 className="text-6xl font-bold text-gray-900 leading-tight">
            Where developers
            <br />
            <span className="text-cyan-600">learn & share</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Get answers to your coding questions, share your knowledge with the
            community, and build your reputation as a developer.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Button
              size="lg"
              onClick={() => navigate("auth/register")}
              className="bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-200"
            >
              Start Learning
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate("auth/login")}
              className="border-2 border-cyan-600 text-cyan-600 hover:bg-cyan-600 hover:text-white px-8 py-4 text-lg transition-all duration-200"
            >
              Sign In
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex items-center justify-center space-x-8 pt-12 text-gray-500">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Free forever</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>No spam</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Join in seconds</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why developers choose Uttar
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to grow as a developer and connect with the
            community
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-8 w-8 text-cyan-600" />
              </div>
              <CardTitle className="text-xl font-semibold">
                Ask Questions
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <CardDescription className="text-gray-600 leading-relaxed">
                Get help from experienced developers in our supportive
                community. No question is too basic or too advanced.
              </CardDescription>
            </CardContent>
          </Card>

          {/* Feature 2 */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-xl font-semibold">
                Share Knowledge
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <CardDescription className="text-gray-600 leading-relaxed">
                Help others by sharing your expertise and solutions. Build your
                reputation while making a difference.
              </CardDescription>
            </CardContent>
          </Card>

          {/* Feature 3 */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="h-8 w-8 text-purple-600" />
              </div>
              <CardTitle className="text-xl font-semibold">
                Grow Together
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <CardDescription className="text-gray-600 leading-relaxed">
                Earn reputation points, unlock achievements, and connect with
                like-minded developers from around the world.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-cyan-600">1K+</div>
              <div className="text-gray-600 mt-2">Developers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-cyan-600">5K+</div>
              <div className="text-gray-600 mt-2">Questions</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-cyan-600">10K+</div>
              <div className="text-gray-600 mt-2">Answers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-cyan-600">95%</div>
              <div className="text-gray-600 mt-2">Solved</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <Card className="bg-gradient-to-r from-cyan-600 to-blue-600 border-0 text-white">
          <CardContent className="text-center py-16">
            <h2 className="text-4xl font-bold mb-4">
              Ready to join the community?
            </h2>
            <p className="text-xl text-cyan-100 mb-8 max-w-2xl mx-auto">
              Create your account today and start your journey as part of our
              developer community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => navigate("auth/register")}
                className="bg-white text-cyan-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
              >
                Create Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate("auth/login")}
                className="border-2 border-white text-white hover:bg-white hover:text-cyan-600 px-8 py-4 text-lg font-semibold"
              >
                Sign In
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

    <Footer/>
    </div>
  );
}
