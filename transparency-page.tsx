import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import FundReport from "@/components/transparency/fund-report";

export default function TransparencyPage() {
  return (
    <>
      <Helmet>
        <title>Transparansi Dana - Catmunitty</title>
        <meta name="description" content="Laporan transparansi penggunaan dana untuk membantu kucing jalanan. Kami berkomitmen untuk transparan dalam pengelolaan dana donasi." />
      </Helmet>

      <Header />
      
      <main className="py-12 md:py-16 bg-dark">
        <div className="container mx-auto">
          <div className="max-w-5xl mx-auto text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Transparansi Dana</h1>
            <p className="text-cream-dark opacity-90 max-w-3xl mx-auto">
              Kami berkomitmen pada transparansi penggunaan dana. Setiap rupiah yang disumbangkan
              akan dikelola dengan penuh tanggung jawab untuk membantu kucing jalanan yang membutuhkan.
            </p>
          </div>
          
          <FundReport />
        </div>
      </main>
      
      <Footer />
    </>
  );
}