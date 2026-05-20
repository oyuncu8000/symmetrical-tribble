import { useEffect } from "react";
import { Layout } from "@/components/Layout";
import { HeroBanner } from "@/components/HeroBanner";
import { Slider } from "@/components/Slider";
import { WoxAI } from "@/components/WoxAI";
import { sliders } from "@/data/content";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <Layout>
      <HeroBanner />
      
      <div className="relative z-20 -mt-20">
        <WoxAI />
        
        <div className="flex flex-col pb-20">
          {sliders.map((slider, index) => (
            <motion.div
              key={slider.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Slider data={slider} />
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
