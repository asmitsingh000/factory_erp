import Navbar from '../components/navbar'

export default function OwnerLayout({ children }) {
  return (
    <>
      <Navbar role="owner" />
      {children}
    </>
  )
}