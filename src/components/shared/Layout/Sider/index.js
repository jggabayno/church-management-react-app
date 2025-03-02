import './index.scss'
import Menu from '../../Menu'
export default function Sider({routes}){
  return (
    <aside>
      <Menu routes={routes}/>
    </aside>
  )
}