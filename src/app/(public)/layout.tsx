
import Header from "@/components/public/header/header2";
import Footer from "@/components/public/footer/Footer";

export default function PublicLayout({ 
    children,
    modal 
}: Readonly<{ 
    children: React.ReactNode;
    modal: React.ReactNode;
}>) {

    return (
        <>
            <Header />
            <main>
                {children}
            </main>
            <Footer />
            {modal}
        </>
    );
}
