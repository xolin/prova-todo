import { mount } from '@vue/test-utils'
import TodoList from '@/components/TodoList.vue'
import TodoListItem from "@/components/TodoListItem.vue"

describe('TodoList', () => {
  test('is a Vue instance', () => {
    const wrapper = mount(TodoList)
    expect(wrapper.vm).toBeTruthy()
  }),
  test('Todo list initiated', () => {
    const wrapper = mount(TodoList)
    expect(wrapper.find('h2').text()).toContain('TO DO')
  }),
  test("TodoListItem rendered", async () => {
    const wrapper = mount(TodoList);
    const task = {
      id: new Date().valueOf(),
      text: "Demo task",
      done: false,
    };
    await wrapper.setData({
      tasks: [task],
    });

    expect(wrapper.findComponent(TodoListItem).exists()).toBe(true);
  }),
  test('addTask method', async () => {
    const idTask = 1636998691369
    const newTask = { id: idTask, text: "Pay the rent", done: true }
    const wrapper = mount(TodoList)
    const setItem = jest.spyOn(window.localStorage.__proto__, 'setItem');
    localStorage.setItem(idTask, JSON.stringify(newTask));
    wrapper.vm.updateList()

    expect(setItem).toHaveBeenCalled()
    expect(wrapper.emitted()).toBeTruthy()    
    expect(wrapper.vm.$data.tasks[0]).toEqual(newTask)
    localStorage.removeItem(idTask)
  })
})
