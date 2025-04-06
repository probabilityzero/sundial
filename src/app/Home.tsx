import { DashboardSession } from '../components/DashboardSession';
import { DashboardGoal } from '../components/DashboardGoal';
import { motion } from 'framer-motion';

function HomePage() {

  return (
    <motion.div
      className="flex flex-col overflow-hidden w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
        <div className="w-full max-w-5xl mx-auto px-4 flex justify-center">
        <DashboardSession />
        </div>
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
        <DashboardGoal />
        </div>
    </motion.div>
  );
}

export default HomePage;
