'use client';

import { motion } from 'framer-motion';
import { FaChevronRight } from 'react-icons/fa';

interface RouteNode {
  path: string;
  description: string;
  children?: RouteNode[];
}

const routes: RouteNode[] = [
  {
    path: '/',
    description: 'Home page',
    children: [
      {
        path: '/marketplace',
        description: 'Browse and purchase products',
        children: [
          {
            path: '/marketplace/product/:id',
            description: 'Individual product details'
          }
        ]
      },
      {
        path: '/trades',
        description: 'Trade listings and management',
        children: [
          {
            path: '/trades/create',
            description: 'Create new trade'
          },
          {
            path: '/trades/:id',
            description: 'Trade details'
          }
        ]
      },
      {
        path: '/auth',
        description: 'Authentication routes',
        children: [
          {
            path: '/auth/farmer/login',
            description: 'Farmer & Customer login'
          },
          {
            path: '/auth/customer/signup',
            description: 'Customer registration'
          },
          {
            path: '/auth/farmer/signup',
            description: 'Farmer registration'
          }
        ]
      },
      {
        path: '/profile',
        description: 'User profile management',
        children: [
          {
            path: '/profile/addresses',
            description: 'Manage delivery addresses'
          },
          {
            path: '/profile/orders',
            description: 'Order history'
          }
        ]
      },
      {
        path: '/legal',
        description: 'Legal information',
        children: [
          {
            path: '/legal/terms',
            description: 'Terms of Service'
          },
          {
            path: '/legal/privacy',
            description: 'Privacy Policy'
          },
          {
            path: '/legal/returns',
            description: 'Return Policy'
          },
          {
            path: '/legal/shipping',
            description: 'Shipping Policy'
          }
        ]
      }
    ]
  }
];

const RouteTree = ({ routes, level = 0 }: { routes: RouteNode[], level?: number }) => {
  return (
    <div className={`space-y-2 ${level > 0 ? 'ml-6 mt-2' : ''}`}>
      {routes.map((route, index) => (
        <motion.div
          key={route.path}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: level * 0.1 + index * 0.05 }}
        >
          <div className="flex items-start group">
            <FaChevronRight className={`mt-1.5 mr-2 text-green-500 transition-transform ${
              route.children ? 'transform group-hover:rotate-90' : ''
            }`} />
            <div>
              <div className="flex items-center">
                <code className="text-sm bg-gray-100 px-2 py-1 rounded font-mono text-green-600">
                  {route.path}
                </code>
                <span className="ml-3 text-gray-600">{route.description}</span>
              </div>
              {route.children && <RouteTree routes={route.children} level={level + 1} />}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default function RoutesMap() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 pt-20">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Routes Map</h1>
          <p className="text-gray-600 mb-8">
            Complete structure of available routes in the application
          </p>
          
          <RouteTree routes={routes} />
          
          <div className="mt-8 pt-8 border-t">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Legend</h2>
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                <span className="text-gray-600">Static routes</span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 border-2 border-green-500 rounded-full mr-2"></span>
                <span className="text-gray-600">Dynamic routes with parameters</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 