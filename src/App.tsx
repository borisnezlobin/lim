import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { HomePage } from './pages/Home'
import { AddOrEditLimitPage } from './pages/AddOrEditLimit'
import { UsagePage } from './pages/UsagePage';
import { LimitControllerProvider } from './lib/LimitControllerContext';
import { UsageProvider } from './lib/UsageContext';

function App() {
    return (
        <UsageProvider>
            <LimitControllerProvider>
                <MemoryRouter>
                    <Routes>
                        <Route path='/' element={<HomePage />} />
                        <Route path="/create" element={<AddOrEditLimitPage />} />
                        <Route path="/edit" element={<AddOrEditLimitPage />} />
                        <Route path="/usage" element={<UsagePage />} />
                    </Routes>
                </MemoryRouter>
            </LimitControllerProvider>
        </UsageProvider>
    )
}

export default App;