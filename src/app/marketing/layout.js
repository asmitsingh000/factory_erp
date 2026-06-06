import Navbar from '../components/navbar'

export default function MarketingLayout({ children }) {
  return (
    <>
      <Navbar role="marketing" />
      {children}
    </>
  )
}