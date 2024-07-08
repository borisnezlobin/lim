import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { HomePage } from './pages/Home'
import { AddLimitPage } from './pages/AddLimit'
import { UsagePage } from './pages/UsagePage';

function App() {

    return (
        <main>
            <MemoryRouter>
                <Routes>
                    <Route path='/' element={<HomePage />} />
                    <Route path="/create" element={<AddLimitPage />} />
                    <Route path="/usage" element={<UsagePage />} />
                </Routes>
            </MemoryRouter>
        </main>
    )
}

export default App;