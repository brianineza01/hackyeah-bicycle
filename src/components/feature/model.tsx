'use client'

import { useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'
import { Label, Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const issue = [
    {
        id: 1,
        name: 'Blocken Road',
        avatar:
            'https://cdn.pixabay.com/photo/2013/07/12/15/39/construction-area-150275_1280.png',
    },
    {
        id: 2,
        name: 'Accident',
        avatar:
            'https://cdn.pixabay.com/photo/2013/07/12/17/21/accident-152075_1280.png',
    },
    {
        id: 3,
        name: 'Traffic Jam',
        avatar:
            'https://cdn.pixabay.com/photo/2018/06/07/23/08/jam-3461258_1280.png',
    }
]

export default function ReportModel({ open, handleClose, address }) {
    const [selected, setSelected] = useState(issue[0]);
    const [loading, setLoading] = useState(false);

    const onSubmit = async () => {
         const data = {
            latitude: address.latitude, 
            longitude: address.longitude, 
            issue: selected.name
         }
         setLoading(true);
         const response = await fetch(
            `api/user-report`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data)
            }
          );
          if(response.status == 200){
            toast.success("Your report has been submitted")
          } else {
            toast.error("Samething unxpected happened please try again")
          }
          setLoading(false)
        //   handleClose()
          console.log(response.status);
    }

    return (
        <Dialog open={open} onClose={handleClose} className="relative z-10">
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
            />
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <DialogPanel
                        transition
                        className="w-full md:w-1/2 lg:w-1/3 p-4 relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full  data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95 "
                    >
                        <h2 className='text-center font-bold mb-4 mt-3'>Report issue from road</h2>
                        <div className='mb-12'>

                       
                        <Listbox value={selected} onChange={setSelected} >
                            <Label className="block text-sm font-medium leading-6 text-gray-900">Issue</Label>
                            <div className="relative mt-2">
                                <ListboxButton className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6">
                                    <span className="flex items-center">
                                        <img alt="" src={selected.avatar} className="h-5 w-5 flex-shrink-0 rounded-full" />
                                        <span className="ml-3 block truncate">{selected.name}</span>
                                    </span>
                                    <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                                        <ChevronUpDownIcon aria-hidden="true" className="h-5 w-5 text-gray-400" />
                                    </span>
                                </ListboxButton>

                                <ListboxOptions
                                    transition
                                    className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in sm:text-sm"
                                >
                                    {issue.map((el) => (
                                        <ListboxOption
                                            key={el.id}
                                            value={el}
                                            className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white"
                                        >
                                            <div className="flex items-center">
                                                <img alt="" src={el.avatar} className="h-5 w-5 flex-shrink-0 rounded-full" />
                                                <span className="ml-3 block truncate font-normal group-data-[selected]:font-semibold">
                                                    {el.name}
                                                </span>
                                            </div>

                                            <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 group-data-[focus]:text-white [.group:not([data-selected])_&]:hidden">
                                                <CheckIcon aria-hidden="true" className="h-5 w-5" />
                                            </span>
                                        </ListboxOption>
                                    ))}
                                </ListboxOptions>
                            </div>
                        </Listbox>
                        </div>

                        <div className="mb-4 bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                            {
                                !loading ?                             <button
                                type="button"
                                onClick={onSubmit}
                                className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                            >
                                Submit
                            </button>
                            : 
                            <button disabled type="button" className="py-2.5 px-5 me-2 text-sm font-medium text-white ml-3 bg-red-600 rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 inline-flex items-center ">
                            <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-gray-200 animate-spin dark:text-gray-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="#1C64F2"/>
                            </svg>
                            Loading...
                            </button>
                            }
                            <button
                                type="button"
                                data-autofocus
                                onClick={handleClose}
                                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                            >
                                Cancel
                            </button>
                        </div>
                    </DialogPanel>
                </div>
            </div>
            <ToastContainer autoClose={5000} position="bottom-right"  className="mb-8"/>
        </Dialog>
    )
}
