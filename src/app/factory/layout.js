import Navbar from "../components/navbar"

export default function FactoryLayout({ children }) {
  return (
    <>
      <Navbar role="factory" />
      {children}
    </>
  )
}