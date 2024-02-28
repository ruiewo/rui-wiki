import { loadDirectory, navigation } from './components/navigation';
import { main } from './components/main';
import './styles/reset.css';
import './styles/index.css';


async function initialize() {
  document.body.classList.add('dark');
  document.getElementById('app')!.appendChild(
    <>
      {navigation}
      {main}
    </>
  );

  loadDirectory();
}

initialize();
