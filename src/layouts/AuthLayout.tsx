import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'

export function AuthLayout() {
  return (
    <div className="relative flex min-h-screen items-center justify-center p-4">
      {/* Background image covering entire screen */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/background.jpg)' }}
      />
      
      {/* Dark overlay for better readability */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Centered split card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-4xl"
      >
        <Card className="shadow-2xl bg-white/95 backdrop-blur-sm border-white/20 overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col lg:flex-row">
              {/* Left side - Logo and caption */}
              <div className="lg:w-1/2 bg-primary p-12 flex flex-col items-center justify-center text-center">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <div className="w-24 h-24 mx-auto mb-6 bg-white rounded-full flex items-center justify-center">
                    <img
                      src="/skillbridge-splash.png"
                      alt="Skillbridge Logo"
                      className="w-20 h-20 object-contain"
                    />
                  </div>
                  <h1 className="text-3xl font-bold text-white mb-3">
                    Skillbridge Admin Panel
                  </h1>
                  <p className="text-base text-white/90">
                    Manage your artisan platform with powerful tools and insights. 
                    Monitor applications, track performance, and grow your community.
                  </p>
                </motion.div>
              </div>

              {/* Right side - Login form */}
              <div className="lg:w-1/2 p-12">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-foreground">Welcome back</h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Sign in to your admin account to continue
                    </p>
                  </div>
                  <Outlet />
                </motion.div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
