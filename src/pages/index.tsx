import MainScene from '@/components/Scene'
import HUD from '@/components/HUD'


export default function Home() {
  return (
    <div>
      <main className="w-screen h-screen bg-black overflow-hidden">
        <MainScene />
        <HUD />
      </main>
    </div>
  );
}
