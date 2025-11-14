'use client'

import Link from 'next/link'
import { Leaf, Mail, Github, Twitter, Linkedin } from 'lucide-react'

const footerSections = [
  {
    title: 'Product',
    links: [
      { name: 'Features', href: '#features' },
      { name: 'How it Works', href: '#how-it-works' },
      { name: 'Disease Database', href: '/diseases' },
      { name: 'API Documentation', href: '/docs' }
    ]
  },
  {
    title: 'Company',
    links: [
      { name: 'About Us', href: '/about' },
      { name: 'Our Mission', href: '/mission' },
      { name: 'Contact', href: '/contact' },
      { name: 'Careers', href: '/careers' }
    ]
  },
  {
    title: 'Resources',
    links: [
      { name: 'Help Center', href: '/help' },
      { name: 'Farmers Guide', href: '/guide' },
      { name: 'Research Papers', href: '/research' },
      { name: 'Blog', href: '/blog' }
    ]
  },
  {
    title: 'Legal',
    links: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
      { name: 'Data Protection', href: '/data-protection' }
    ]
  }
]

const socialLinks = [
  { name: 'Email', icon: Mail, href: 'mailto:alfred.dev8@gmail.com' },
  { name: 'GitHub', icon: Github, href: 'https://github.com/sibby-killer/cropguard-ai-web' },
  { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/cropguardai' },
  { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com/in/alfred-nyongesa' }
]

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-16">
        {/* Main footer content */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand section */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                <Leaf className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">CropGuard AI</span>
            </Link>
            <p className="text-gray-400 text-sm mb-6 max-w-sm">
              Protecting crops worldwide with AI-powered disease detection. 
              Making advanced agricultural technology accessible to every farmer.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target={social.href.startsWith('http') ? '_blank' : undefined}
                  rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="w-10 h-10 bg-gray-800 hover:bg-primary rounded-lg flex items-center justify-center transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Footer sections */}
          {footerSections.map((section) => (
            <div key={section.title} className="col-span-1">
              <h3 className="font-semibold text-white mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter signup */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-xl font-semibold text-white mb-2">Stay Updated</h3>
            <p className="text-gray-400 text-sm mb-6">
              Get the latest updates on new features, research, and agricultural insights.
            </p>
            <div className="flex max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button className="px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-r-lg transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-400 mb-4 md:mb-0">
            © 2024 CropGuard AI. All rights reserved.
          </div>
          
          <div className="text-sm text-gray-400 text-center md:text-right">
            Made with 💚 for farmers by{' '}
            <a 
              href="mailto:alfred.dev8@gmail.com"
              className="text-primary hover:text-primary/80 transition-colors"
            >
              Alfred Nyongesa
            </a>
          </div>
        </div>

        {/* Mission statement */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="text-center">
            <p className="text-sm text-gray-500 italic">
              "Supporting UN SDG 2: Zero Hunger through accessible agricultural technology"
            </p>
            <div className="flex justify-center items-center mt-4 space-x-6 text-xs text-gray-600">
              <span>🌱 Sustainable Agriculture</span>
              <span>🤝 Global Food Security</span>
              <span>🔬 Open Source Innovation</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}