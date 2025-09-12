import { useParams } from 'react-router-dom'

export default function ClassDetails() {
  const { id } = useParams()
  return <div className="p-4 text-white">Detalhes da Aula {id}</div>;
}
