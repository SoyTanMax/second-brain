import type { ActionArgs } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import type { Habit } from "~/types/Habit"
import supabase from '~/utls/supabase'

export async function loader(){
    const {data: habits, error} = await supabase.from('habits').select('*');
    if(error){
        console.log(error.message);
    };
    return {
        habits
    };
};
export async function action({request}: ActionArgs){
    let formData = await request.formData();
    let {_action, ...values} = Object.fromEntries(formData);

    if(_action === 'delete'){
        return await supabase.from('habits').delete().eq('id', values.id);
    }

    if(_action === 'create'){
        const title = values.title
        return await supabase.from('habits').insert({title})
    }
}
export default function Dashboard(){
    const {habits} = useLoaderData();

    return (
        <div>
            <h1>Dashboard</h1>
            <h2>Habit Tracker</h2>
            <ul style={{ padding: 0}}>
                {habits.map((habit: Habit) => (
                    <li key={habit.id} style={{display: 'flex', maxWidth: 250, justifyContent: 'space-between'}}>
                        <div style={{textDecoration: habit.completed ? 'underline': 'none'}}>
                            {habit.title}
                        </div>
                        <Form method="post">
                            <div style={{display: 'flex', gap: 12}}>
                                <input type="hidden" name="id" value={habit.id} />
                                <button>✔︎</button>
                                <button type="submit" name="_action" value="delete">✘</button>
                            </div>
                        </Form>
                    </li>
                ))}
            </ul>
            <Form method="post">
                <input type="text" name="title" />{''}
                <button type="submit" name="_action" value="create">Add habit</button>
            </Form>
        </div>
    )
}
