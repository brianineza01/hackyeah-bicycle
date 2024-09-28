"use client"

import BottomNavigation from "@/components/bottomNavigation";
import { CyclistComponent } from "@/components/feature/cyclist-component";

export default function Home() {
  return (
    <div>
      <main>
        <CyclistComponent />
      </main>
      <footer>
        <BottomNavigation/>
      </footer>
    </div>
  );
}

// import dynamic from 'next/dynamic'

// // Import your component dynamically and disable SSR
// const CyclistComponentNoSSR = dynamic(
//   () => import('../components/feature/cyclist-component').then((mod) => mod.CyclistComponent),
//   { ssr: false }
// );


// export default function Home() {
//   return (
//     <div>
//       <CyclistComponentNoSSR />

//     </div>
//   );
// }
