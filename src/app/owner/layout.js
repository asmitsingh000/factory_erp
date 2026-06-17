import Navbar from './components/navbar'

export default function OwnerLayout({ children }) {
  // const tiles {()=>()}
  return (
    <>
      <Navbar role="owner" />
      {children}
    </>
  )
}