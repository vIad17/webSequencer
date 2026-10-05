## Секреты CI/CD

| Секрет | Описание |
|---|---|
| `HOST` | IP или домен сервера |
| `PORT` | SSH-порт |
| `USERNAME` | Пользователь сервера |
| `SSH_PRIVATE_KEY` | Приватный SSH-ключ |
| `KNOWN_HOSTS` | Host-ключ сервера из `known_hosts` |

> `KNOWN_HOSTS` - это не отпечаток ключа. Отпечаток нужен только для проверки.

### Создать ключ для деплоя

```bash
ssh-keygen -t ed25519 -a 100 -f ~/.ssh/ci_deploy_key -C "ci-deploy"
cat ~/.ssh/ci_deploy_key.pub >> ~/.ssh/authorized_keys
```

- `ci_deploy_key` в секрет `SSH_PRIVATE_KEY`
- `ci_deploy_key.pub` добавить на сервер в `~/.ssh/authorized_keys`

### Получить KNOWN_HOSTS

```bash
ssh-keyscan -H -p PORT -t ed25519 HOST
```

Результат вставить в секрет `KNOWN_HOSTS`.

### Проверить отпечаток сервера

На сервере:

```bash
ssh-keygen -lf /etc/ssh/ssh_host_ed25519_key.pub
```

Локально:

```bash
ssh-keyscan -p PORT -t ed25519 HOST | ssh-keygen -lf -
```

Отпечатки должны совпадать.
