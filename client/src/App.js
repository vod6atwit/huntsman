import { Landing, Register, Error, ProtectedRoute } from './pages';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import {
  AddJob,
  AllJob,
  Profile,
  Stats,
  SharedLayout,
  EditJob,
} from './pages/dashboard';

function App() {
  return (
    <BrowserRouter>
      {/* <nav>
        <Link to="/">Dashboard</Link>
        <Link to="/register">Register</Link>
        <Link to="/landing">Landing</Link>
      </nav> */}
      <Routes>
        {/* <Route path="/" element={<Dashboard />} /> */}

        {/* element can be html or components */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <SharedLayout />
            </ProtectedRoute>
          }
        >
          {/* related routes */}
          {/* index will reference to the home page */}
          <Route index element={<Stats />} />
          <Route path="all-jobs" element={<AllJob />} />
          <Route path="add-jobs" element={<AddJob />} />
          <Route path="edit-job" element={<EditJob />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        <Route path="/register" element={<Register />} />
        <Route path="/landing" element={<Landing />} />

        {/* catch this route if all the routes above not match */}
        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
