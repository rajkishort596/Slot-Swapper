import { Outlet } from "react-router-dom";
import Container from "../components/Container/Container";
import Header from "../components/Header/Header";

const RootLayout = () => {
  return (
    <Container>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 relative px-4 lg:px-6 xl:px-31 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </Container>
  );
};

export default RootLayout;
