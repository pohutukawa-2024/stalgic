import { useViewProfile } from '../hooks/useViewProfile'
import { Input } from '../ui/Input'
import { Label } from '../ui/Label'
import { Button } from '../ui/Button'
import { updateUser } from '../../models/user'
import { useState } from 'react'
import DatePicker from 'react-datepicker'
import { format } from 'date-fns'

function ProfilePage() {
  // const updateProfile =
  // const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault()

  //   updateProfile.mutate({
  //     name: profileForm.name,
  //     email: profileForm.email,
  //     dob: profileForm.dob,
  //     profile_image?: profileForm.image,
  //   })
  //   setProfileForm({
  //     name: '',
  //     email: '',
  //     dob: '',
  //     profile_image: '',
  //   })
  // }

  const [profileForm, setProfileForm] = useState<updateUser>({
    name: '',
    email: '',
    dob: '',
    profile_image: '',
  })

  const [edit, setEdit] = useState<boolean>(false)

  console.log(profileForm)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfileForm({ ...profileForm, [name]: value })
  }

  const [date, setDate] = useState(new Date())
  const handleDateChange = (date: Date | null) => {
    if (date) {
      setDate(date)
      setProfileForm({ ...profileForm, dob: format(date, 'dd/MM/yyyy') })
      console.log('setForm', {
        ...profileForm,
        time: format(date, 'dd/MM/yyyy'),
      })
    }
  }

  const { data, isLoading, isError } = useViewProfile()

  if (isLoading) {
    return <p>Loading</p>
  }
  if (isError) {
    return <p>Error</p>
  }
  if (data) {
    return (
      <>
        <section className="bg-[#13A25B]  pl-16 font-lalezar">
          <div>
            <h1 className="pt-20 text-9xl font-bold tracking-wider text-white">
              PROFILE
            </h1>
          </div>
        </section>

        <div
          className={`group m-16 flex h-80 w-80 items-center justify-center rounded-full bg-[#ffffff] p-6 text-[#13A25B]`}
        >
          <img
            src={data.profile_image}
            className="size-40"
            alt="user profile"
          ></img>
          <div className="absolute hidden group-hover:block">
            <button className="rounded-full  bg-[#13A25B] text-[#ffffff]">
              <p className="p-2 px-4 font-labrada text-xl">Edit Photo</p>
            </button>
          </div>
        </div>

        <section className="bg-[#13A25B] bg-[#13A25B] pb-12  pl-16 font-lalezar">
          {/* <form>  */}
          <div className="flex">
            <div
              className={`mb-8 mr-12 h-64 w-80 rounded-lg bg-[#ffffff] p-6 text-[#13A25B]`}
            >
              <h2 className="mb-12 font-lalezar text-7xl text-[#13A25B]">
                NAME
              </h2>
              <p className="space-l mb-4 font-labrada text-xl">
                {data.name ? data.name : 'name not found'}
              </p>
              {edit === true && (
                <Input
                  aria-label="name"
                  type="name"
                  id="name"
                  name="name"
                  onChange={handleChange}
                  placeholder="Edit name"
                  value={profileForm.name}
                />
              )}
            </div>
            <div
              className={`mb-8 mr-12  h-64 w-80 rounded-lg bg-[#ffffff] p-6 text-[#13A25B]`}
            >
              <h2 className="mb-12 font-lalezar text-7xl text-[#13A25B]">
                EMAIL
              </h2>
              <p className="space-l mb-4 font-labrada text-xl">
                {data.email ? data.email : 'email not found'}
              </p>
              {edit === true && (
                <Input
                  aria-label="email"
                  type="email"
                  id="email"
                  name="email"
                  onChange={handleChange}
                  placeholder="edit email"
                  value={profileForm.email}
                />
              )}
            </div>
            <div
              className={`mb-8 mr-12  h-64 w-80 rounded-lg bg-[#ffffff] p-6 text-[#13A25B]`}
            >
              <h2 className="mb-12 font-lalezar text-7xl text-[#13A25B]">
                DOB
              </h2>
              <p className="space-l mb-4 font-labrada text-xl">
                {data.dob ? data.dob : 'DOB not found'}
              </p>
              {edit === true && (
                <DatePicker
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  selected={date}
                  onChange={handleDateChange}
                />
              )}
            </div>
          </div>
          {edit === false && (
            <button
              onClick={() => setEdit(!edit)}
              className="rounded-full bg-[#ffffff] px-8 py-2 text-3xl text-[#13A25B]"
            >
              edit
            </button>
          )}
          {edit === true && (
            <>
              <button
                onClick={() => setEdit(!edit)}
                className="rounded-full bg-[#ffffff] px-8 py-2 text-3xl text-[#13A25B]"
              >
                {' '}
                Save
              </button>
            </>
          )}
          {/* </form>*/}
        </section>
      </>
    )
  }
}
export default ProfilePage
