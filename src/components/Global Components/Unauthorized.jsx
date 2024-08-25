export default function Unauthorized({theme}) {
  return (
    <div className={`${theme.bg} h-screen w-full text-center pt-32 text-3xl text-red-400`}>
      Unauthorized action
    </div>
  )
}