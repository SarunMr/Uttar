import { useNavigate } from "react-router-dom";
//Images and icons
import LogoWhiteText from "./../../assets/logo/LogoWhiteText.png";
import { Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <img src={LogoWhiteText} alt="Mentaro Logo" className="h-10" />
              </div>
            </div>
            <p className="text-gray-400 leading-relaxed">
              A community-driven platform where developers learn, share
              knowledge, and grow together. Built with ❤️ for the developer
              community.
            </p>
          </div>

          {/* About Us Section */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">About Us</h4>
            <div className="space-y-3 text-gray-400">
              <p className="text-sm leading-relaxed">
                Uttar was created to foster a supportive environment where
                developers of all skill levels can ask questions, share
                solutions, and learn from each other.
              </p>
              <div className="space-y-2">
                <p className="text-sm">
                  🚀 <strong className="text-white">Mission:</strong>{" "}
                  Democratize coding knowledge
                </p>
                <p className="text-sm">
                  💡 <strong className="text-white">Vision:</strong> Every
                  developer empowered
                </p>
                <p className="text-sm">
                  🤝 <strong className="text-white">Values:</strong> Community,
                  learning, growth
                </p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Quick Links</h4>
            <div className="space-y-2">
              <button
                onClick={() => navigate("/")}
                className="block text-gray-400 hover:text-cyan-400 transition-colors text-sm"
              >
                Home
              </button>
              <button
                onClick={() => navigate("/auth/register")}
                className="block text-gray-400 hover:text-cyan-400 transition-colors text-sm"
              >
                Join Community
              </button>
              <button
                onClick={() => navigate("/auth/login")}
                className="block text-gray-400 hover:text-cyan-400 transition-colors text-sm"
              >
                Sign In
              </button>
              <a
                href="#"
                className="block text-gray-400 hover:text-cyan-400 transition-colors text-sm"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="block text-gray-400 hover:text-cyan-400 transition-colors text-sm"
              >
                Terms of Service
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Get in Touch</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-400">
                <Mail className="h-4 w-4 text-cyan-400" />
                <span className="text-sm">sarunmaharjan38@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <Phone className="h-4 w-4 text-cyan-400" />
                <span className="text-sm">+977 9808703816</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <MapPin className="h-4 w-4 text-cyan-400" />
                <span className="text-sm">Teku, Nepal</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 Uttar. All rights reserved. Built for developers, by
            developers.
          </p>
        </div>
      </div>
    </footer>
  );
}
