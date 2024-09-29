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

    const onSubmit = async () => {
         const data = {
            latitude: address.latitude, 
            longitude: address.longitude, 
            issue: selected.name
         }

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
                        className=" p-4 relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
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
{/* 
                        <div className='mt-3'>
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                Email address
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={email}
                                    onChange={handleEmail}
                                    required
                                    autoComplete="email"
                                    className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div> */}

                        {/* <div className='mt-3'>
                            <label htmlFor="address" className="block text-sm font-medium leading-6 text-gray-900">
                                Address
                            </label>
                            <SelectAdress onSelect={setAddress}></SelectAdress>
                        </div> */}


                        <div className="mb-4 bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                            <button
                                type="button"
                                onClick={onSubmit}
                                className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                            >
                                Submit
                            </button>
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
