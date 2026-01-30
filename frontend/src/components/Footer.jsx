import React from "react";

const Footer = () => {
  return (
    <footer className="bg-blue-600 text-white py-12 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div>
            <h3 className="text-2xl font-bold mb-2">PickPlan</h3>
            <p className="text-blue-100 text-sm">
              We choose the perfect internet plan for you...
            </p>
            <div className="mt-4 text-blue-100 text-sm">
              <p className="font-semibold">Making better connectivity choices</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-blue-100 text-sm">
              <li>
                <a href="/guest" className="hover:text-white transition">
                  Get Recommendation
                </a>
              </li>
              <li>
                <a href="/login" className="hover:text-white transition">
                  Login
                </a>
              </li>
              <li>
                <a href="/signup" className="hover:text-white transition">
                  Sign Up
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-blue-100 text-sm">
              <li>
                <span className="hover:text-white transition cursor-default">
                  Package Recommendations
                </span>
              </li>
              <li>
                <span className="hover:text-white transition cursor-default">
                  Compare Plans
                </span>
              </li>
              <li>
                <span className="hover:text-white transition cursor-default">
                  Provider Marketplace
                </span>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3 text-blue-100 text-sm">
              <div>
                <p className="font-semibold text-white">Email</p>
                <a
                  href="mailto:info@pickplan.com"
                  className="hover:text-white transition"
                >
                  info@pickplan.com
                </a>
              </div>
              <div>
                <p className="font-semibold text-white">Phone</p>
                <p>+1 (555) 123-4567</p>
              </div>
              <div>
                <p className="font-semibold text-white">Address</p>
                <p>162/A/2, Colombo 07.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-blue-400 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center md:text-left text-blue-100 text-sm">
            <div>
              <p>© 2026 PickPlan. All rights reserved.</p>
            </div>
            <div className="space-x-4 flex justify-center md:justify-start">
              <a href="#" className="hover:text-white transition">
                Privacy Policy
              </a>
              <span>•</span>
              <a href="#" className="hover:text-white transition">
                Terms of Service
              </a>
              <span>•</span>
              <a href="#" className="hover:text-white transition">
                Contact
              </a>
            </div>
            <div className="space-x-4 flex justify-center md:justify-end">
              <a href="#" className="hover:text-white transition">
                Facebook
              </a>
              <a href="#" className="hover:text-white transition">
                Twitter
              </a>
              <a href="#" className="hover:text-white transition">
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
