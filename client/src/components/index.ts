import type { App } from 'vue'
import { Icon } from './Icon'
import { Dialog } from './Dialog'
import { Form } from './Form'
import { ContentWrap } from './ContentWrap'
import { Table } from './Table'

export const setupGlobCom = (app: App<Element>): void => {
  app.component('Icon', Icon)
  app.component('Dialog', Dialog)
  app.component('Form', Form)
  app.component('ContentWrap', ContentWrap)
  app.component('Table', Table)
}
